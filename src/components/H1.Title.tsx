type H1TitleProps = {
  title: string;
};

export const H1Title = (props: H1TitleProps) => (
  <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
    {props.title} <span className="text-[hsl(280,100%,70%)]">Ticket</span>{" "}
    Concert
  </h1>
);
