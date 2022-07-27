import { useKeenSlider } from 'keen-slider/react'; // import from 'keen-slider/react.es' for to get an ES module
import Image from 'next/future/image';
import type { HTMLAttributes } from 'react';
import { useState } from 'react';

export interface ImageCarouselItem {
  // eslint-disable-next-line react/no-unused-prop-types
  title: string;
  link: string;
  image: string;
}

export interface ImageCarouselProps extends HTMLAttributes<HTMLDivElement> {
  items: ImageCarouselItem[];
  loader?: any;
}

export function ImageCarousel({ items, loader }: ImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView: 1.2,
      spacing: 15,
    },
    breakpoints: {
      '(min-width: 600px)': {
        slides: {
          perView: 1.2,
          spacing: 16,
        },
      },
      '(min-width: 996px)': {
        slides: {
          perView: 1.4,
          spacing: 16,
        },
      },
    },
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider">
        {items.map((item: any, index: number) => {
          return (
            <div key={item.title} className="keen-slider__slide">
              <Image
                loader={loader || null}
                className="block object-contain w-full h-full"
                alt={item.title}
                src={item.image || ''}
                width="1275"
                height="639"
                sizes="60vw"
              />
              {item.title}
            </div>
          );
        })}
      </div>
      {loaded && instanceRef.current && (
        <>
          <Arrow
            left
            onClick={(e: any) =>
              e.stopPropagation() || instanceRef.current?.prev()
            }
            disabled={currentSlide === 0}
          />

          <Arrow
            onClick={(e: any) =>
              e.stopPropagation() || instanceRef.current?.next()
            }
            disabled={
              currentSlide ===
              instanceRef.current.track.details.slides.length - 1
            }
          />
        </>
      )}
    </div>
  );
}
function Arrow(props: {
  disabled: boolean;
  left?: boolean;
  onClick: (e: any) => void;
}) {
  const disabeld = props.disabled ? ' arrow--disabled' : '';
  return (
    <svg
      onClick={props.onClick}
      className={`w-8 h-8 absolute top-1/2 fill-white cursor-pointer ${
        props.left ? 'left-2' : 'right-2'
      } ${disabeld}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      {props.left && (
        <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
      )}
      {!props.left && (
        <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
      )}
    </svg>
  );
}
