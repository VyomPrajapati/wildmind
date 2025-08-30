"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";

export const HeroParallax = ({
  products,
}: {
  products: {
    title?: string;
    link?: string;
    thumbnail: string;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 mb:py-24 overflow-hidden antialiased relative flex flex-col [perspective:1000px] [transform-style:preserve-3d] bg-[#0a1116]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-5 mb-10">
          {firstRow.map((product, index) => (
            <ProductCard product={product} translate={translateX} key={index} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-10 space-x-5">
          {secondRow.map((product, index) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={index + 5}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-5">
          {thirdRow.map((product, index) => (
            <ProductCard product={product} translate={translateX} key={index + 10} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-8xl relative mx-auto py-20 md:py-40 px-2 w-full ml-32">
      <h1 className="text-2xl md:text-7xl font-bold text-white">
      Wild Mind <br /> <span className="ml-4">Your One Stop For AI Solutions</span>
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 text-neutral-200 ml-6">
      India’s First Unified Generative AI Ecosystem For Stunning Creations
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title?: string;
    link?: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }} // Keep only lift effect
      key={product.title}
      className="h-96 w-[30rem] mb:h-64 mb:w-64 relative shrink-0"
    >
      {product.link ? (
        <a href={product.link}>
          <Image
            src={product.thumbnail}
            height={600}
            width={600}
            className="object-cover object-left-top absolute h-full w-full inset-0"
            alt={product.title || "Product"}
          />
        </a>
      ) : (
        <div>
          <Image
            src={product.thumbnail}
            height={600}
            width={600}
            className="object-cover object-left-top absolute h-full w-full inset-0"
            alt={product.title || "Product"}
          />
        </div>
      )}
    </motion.div>
  );
};