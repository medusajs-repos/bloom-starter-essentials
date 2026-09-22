import { indexedCurrency, priceAttribute } from "@/lib/search-client"
import { formatPrice } from "@/lib/utils/price"
import { useCallback, useEffect, useRef, useState } from "react"
import { useRange } from "react-instantsearch"

const toThumb = (
  bound: number | undefined,
  fallback: number,
  min: number,
  max: number
) => {
  if (bound === undefined || !Number.isFinite(bound)) {
    return fallback
  }

  return Math.min(Math.max(bound, min), max)
}

const THUMB_SIZE = 12

const trackOffset = (percent: number) =>
  `${percent}% + ${(0.5 - percent / 100) * THUMB_SIZE}px`

const THUMB_CLASSES = [
  "pointer-events-none absolute inset-x-0 top-0 h-3 w-full appearance-none bg-transparent",
  "focus:outline-none",
  // Only the thumbs are interactive; the track underneath is drawn by the divs.
  "[&::-webkit-slider-runnable-track]:h-3 [&::-webkit-slider-runnable-track]:bg-transparent",
  "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none",
  "[&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3",
  "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border",
  "[&::-webkit-slider-thumb]:border-neutral-900 [&::-webkit-slider-thumb]:bg-white",
  "[&::-webkit-slider-thumb]:cursor-pointer",
  "[&::-moz-range-track]:h-3 [&::-moz-range-track]:bg-transparent [&::-moz-range-track]:border-none",
  "[&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:box-border",
  "[&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3",
  "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border",
  "[&::-moz-range-thumb]:border-neutral-900 [&::-moz-range-thumb]:bg-white",
  "[&::-moz-range-thumb]:cursor-pointer",
].join(" ")

type PriceRangeRefinementProps = {
  currencyCode: string
}

export const PriceRangeRefinement = ({
  currencyCode,
}: PriceRangeRefinementProps) => {
  const { start, range, refine, canRefine } = useRange({
    attribute: priceAttribute("min_price", currencyCode),
  })

  const currency = indexedCurrency(currencyCode)

  // Whole units keep the thumbs on sane stops; the facet's own bounds are
  // widened outwards so no product falls outside the track.
  const boundMin = range.min === undefined ? 0 : Math.floor(range.min)
  const boundMax = range.max === undefined ? 0 : Math.ceil(range.max)

  const [currentMin, currentMax] = start
  const [values, setValues] = useState<[number, number]>([boundMin, boundMax])
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setValues([
      toThumb(currentMin, boundMin, boundMin, boundMax),
      toThumb(currentMax, boundMax, boundMin, boundMax),
    ])
  }, [currentMin, currentMax, boundMin, boundMax])

  const commit = useCallback(() => {
    const [low, high] = values

    refine([
      low <= boundMin ? undefined : low,
      high >= boundMax ? undefined : high,
    ])
  }, [values, refine, boundMin, boundMax])

  const commitRef = useRef(commit)
  commitRef.current = commit

  useEffect(() => {
    if (!isDragging) {
      return
    }

    const end = () => {
      setIsDragging(false)
      commitRef.current()
    }

    window.addEventListener("pointerup", end)
    window.addEventListener("pointercancel", end)

    return () => {
      window.removeEventListener("pointerup", end)
      window.removeEventListener("pointercancel", end)
    }
  }, [isDragging])

  // No bounds means no products with a price in the current results — there is
  // nothing meaningful to drag between.
  if (!canRefine || boundMax <= boundMin) {
    return null
  }

  const span = boundMax - boundMin
  const lowPercent = ((values[0] - boundMin) / span) * 100
  const highPercent = ((values[1] - boundMin) / span) * 100

  const commitProps = {
    onPointerDown: () => setIsDragging(true),
    onKeyUp: commit,
    onBlur: commit,
  }

  return (
    <div data-testid="facet-min_price">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 mb-3">
        Price
      </h3>

      <div className="relative h-3">
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-neutral-300"
          style={{
            left: `${THUMB_SIZE / 2}px`,
            right: `${THUMB_SIZE / 2}px`,
          }}
        />
        <div
          className="absolute top-1/2 h-px -translate-y-1/2 bg-neutral-900"
          style={{
            left: `calc(${trackOffset(lowPercent)})`,
            right: `calc(100% - (${trackOffset(highPercent)}))`,
          }}
        />

        <input
          type="range"
          min={boundMin}
          max={boundMax}
          step={1}
          value={values[0]}
          aria-label="Minimum price"
          data-testid="facet-min_price-min"
          className={THUMB_CLASSES}
          onChange={(event) =>
            setValues(([, high]) => [
              Math.min(Number(event.target.value), high),
              high,
            ])
          }
          {...commitProps}
        />
        <input
          type="range"
          min={boundMin}
          max={boundMax}
          step={1}
          value={values[1]}
          aria-label="Maximum price"
          data-testid="facet-min_price-max"
          className={THUMB_CLASSES}
          onChange={(event) =>
            setValues(([low]) => [
              low,
              Math.max(Number(event.target.value), low),
            ])
          }
          {...commitProps}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-neutral-600 tabular-nums">
        <span>{formatPrice({ amount: values[0], currency_code: currency })}</span>
        <span>{formatPrice({ amount: values[1], currency_code: currency })}</span>
      </div>
    </div>
  )
}
