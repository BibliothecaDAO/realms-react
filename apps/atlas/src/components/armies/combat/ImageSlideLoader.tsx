import { useEffect, useState } from 'react';

interface ImageSlideLoaderProps {
  strings?: string[];
  images?: string[];
}

export const ImageSlideLoader = (props: ImageSlideLoaderProps) => {
  const { strings, images } = props;

  // cycle throught strings every 3 seconds
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(
        (index) => (index + 1) % (strings?.length || images?.length || 0)
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-0 flex flex-wrap justify-center w-full h-full overflow-y-hidden z-100 bg-gray-1000">
      {images && (
        <img
          className="object-cover w-full"
          src={images[index % images.length]}
          alt=""
        />
      )}

      {strings && (
        <span className="absolute self-center text-5xl capitalize animate-pulse">
          {strings[index % strings.length]}
        </span>
      )}
    </div>
  );
};
