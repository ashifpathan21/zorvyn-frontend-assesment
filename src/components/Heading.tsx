export interface HeadingProps {
  heading: string;
  subheading?: string;
  size: "md" | "lg";
}

const Heading = ({ heading, subheading, size }: HeadingProps) => {
  return (
    <div className={`flex flex-col items-start font-sans p-2`}>
      <h1
        className={`font-semibold text-neutral-950 
        ${size === "lg" ? " text-3xl" : "text-xl"}`}
      >
        {heading}
      </h1>
      {subheading && (
        <h3
          className={`text-neutral-700 
        ${size === "lg" ? "text-md" : "text-xs"}
        `}
        >
          {subheading}
        </h3>
      )}
    </div>
  );
};

export default Heading;
