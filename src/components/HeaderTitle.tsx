"use client";

type HeaderTitleProps = {
  title: string;
};

export const HeaderTitle = (props: HeaderTitleProps) => (
  <header className="-ml-16 flex h-12 items-center bg-gradient-to-r from-black to-transparent pl-16">
    <h1 className="text-md font-semibold text-amber-300">{props.title}</h1>
  </header>
);
