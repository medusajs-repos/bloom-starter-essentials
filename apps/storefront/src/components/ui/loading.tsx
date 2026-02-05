import { clsx } from "clsx";

interface LoadingProps {
  /**
   * Number of skeleton rows to display
   */
  rows?: number;
  /**
   * Number of skeleton columns to display
   */
  columns?: number;
  /**
   * Custom height class for each skeleton row
   */
  height?: string;
  /**
   * Custom width class for each skeleton row
   */
  width?: string;
  /**
   * Custom className for styling
   */
  className?: string;
}

const Loading = ({
  rows = 3,
  columns = 1,
  height = "h-4",
  width = "w-full",
  className,
}: LoadingProps) => {
  return (
    <div className={clsx("space-y-2 p-2", className)}>
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {Array.from({ length: columns }, (_, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={clsx(
                "animate-pulse bg-zinc-200 flex-1",
                height,
                width
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { Loading }
export default Loading
