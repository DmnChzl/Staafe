import clsx from 'clsx';
import { useEffect } from 'preact/hooks';
import useToggle from '../hooks/useToggle';
import { isEcoSearchEngine } from '../store';

export default function Hero() {
  const [isAnimated, animateOn, animateOff] = useToggle(true);

  useEffect(() => {
    setTimeout(animateOff, 1000);
  }, []);

  return (
    <div class="absolute inset-0 h-screen w-screen p-4">
      <div
        class={clsx(
          'z-5 flex h-1/2 w-full rounded-lg bg-gradient-to-r',
          isEcoSearchEngine.value && 'from-emerald-500 via-green-500 to-lime-500',
          !isEcoSearchEngine.value && 'from-red-500 via-orange-500 to-amber-500'
        )}>
        <div
          class="relative m-auto h-[156px] w-[210px] cursor-default"
          onMouseEnter={animateOn}
          onMouseLeave={animateOff}>
          <span
            class={clsx(
              'font-poppins absolute top-0 left-0 w-[144px] text-right text-[64px] text-white transition-transform duration-500',
              isAnimated ? 'translate-x-0 translate-y-0' : 'translate-x-[14px] translate-y-[24px]'
            )}>
            Sta
            <span
              class={clsx(
                'transition-opacity delay-[250ms] duration-[250ms]',
                isAnimated ? 'opacity-100' : 'opacity-0'
              )}>
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
              class={clsx(
                'transition-opacity delay-[250ms] duration-[250ms]',
                isAnimated ? 'opacity-100' : 'opacity-0'
              )}>
              S
            </span>
            afe
          </span>
        </div>
      </div>
    </div>
  );
}
