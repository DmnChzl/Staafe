import clsx from 'clsx';
import useToggle from '../hooks/useToggle';

export default function Hero() {
  const [isAnimated, animateOn, animateOff] = useToggle();

  return (
    <div class="absolute top-4 left-4 right-4 z-10 flex h-[calc(50%-1rem)] w-[calc(100%-2rem)] cursor-default rounded-lg  bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500">
      <div class="relative m-auto h-[156px] w-[210px]" onMouseEnter={animateOn} onMouseLeave={animateOff}>
        <span
          class={clsx(
            'font-poppins absolute top-0 left-0 w-[144px] text-right text-[64px] text-white transition-transform duration-500',
            isAnimated ? 'translate-x-0 translate-y-0' : 'translate-x-[14px] translate-y-[24px]'
          )}>
          Sta
          <span
            class={clsx('transition-opacity delay-[250ms] duration-[250ms]', isAnimated ? 'opacity-100' : 'opacity-0')}>
            y
          </span>
        </span>

        <span
          class={clsx(
            'font-poppins absolute bottom-0 right-0 w-[144px] text-left text-[64px] text-transparent transition-transform duration-500',
            isAnimated ? 'translate-x-0 translate-y-0' : '-translate-x-[14px] -translate-y-[24px]'
          )}
          style={{ webkitTextStroke: '2px #fff' }}>
          <span
            class={clsx('transition-opacity delay-[250ms] duration-[250ms]', isAnimated ? 'opacity-100' : 'opacity-0')}>
            S
          </span>
          afe
        </span>
      </div>
    </div>
  );
}
