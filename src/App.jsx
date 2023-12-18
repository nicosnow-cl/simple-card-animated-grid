import { useRef } from 'react';
import './index.css';

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';

const cards_number = 100;

const spring = {
  type: 'spring',
  damping: 20,
  stiffness: 150,
  // when: 'beforeChildren',
  // staggerDirection: -1,
};

const variants = {
  visible: { opacity: 1, scale: 1 },
  hidden: { opacity: 0, scale: 0.5 },
  exit: { opacity: 0, rotateX: 90, scale: 0.5 },
};

function OnReveal({ id, children }) {
  // PB appear on scroll
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-200px' });

  return (
    <div ref={ref} className="w-full h-full">
      <AnimatePresence>
        {isInView && (
          <motion.div
            key={`card-${id}`}
            variants={variants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            exit="exit"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// PB animate 3d
function PBCard3DMove({ id }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseSpringX = useSpring(x);
  const mouseSpringY = useSpring(y);

  const rotateX = useTransform(mouseSpringY, [-0.5, 0.5], ['20deg', '-20deg']);
  const rotateY = useTransform(mouseSpringX, [-0.5, 0.5], ['-20deg', '20deg']);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const { width, height, top, left } = rect;
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const xPerc = mouseX / width - 0.5;
    const yPerc = mouseY / height - 0.5;

    x.set(xPerc);
    y.set(yPerc);
  };

  const handleReset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      key={id}
      className="relative bg-gray-800/50 rounded-lg shadow-lg text-white h-[450px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleReset}
      style={{
        //preserv-3d
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
    >
      {/* <img
        className="object-cover left-0 top-0 absolute p-2 h-full w-full rounded-lg"
        alt="img"
        src={`https://via.assets.so/game.png?id=${id}&q=95&w=360&h=360&fit=fill`}
        style={{
          //preserv-3d
          transformStyle: 'preserve-3d',
        }}
      /> */}

      <div
        className="absolute inset-3 rounded-lg flex flex-col items-center justify-end border border-gray-600 shadow-xl p-3"
        style={{
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
          backgroundImage: `url(https://via.assets.so/game.png?id=${id}&q=95&w=360&h=360&fit=fill)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* <p
          className="text-sm font-bold p-2"
          style={{
            transform: 'translateZ(30px)',
          }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis at
          dicta harum eveniet blanditiis dolorem itaque natus! At, consectetur,
          voluptate, provident sit perspiciatis optio deserunt debitis iusto vel
          sed velit!
        </p> */}

        <button
          className="bg-purple-800 rounded-full px-3 py-2 shadow-md border border-purple-600 hover:bg-purple-700 hover:border-purple-500 uppercase text-xs font-bold transition-all duration-300 ease-in-out shadow-violet-500/80"
          style={{
            transform: 'translateZ(30px)',
          }}
        >
          Ver más
        </button>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-gray-700 p-5 flex flex-col gap-6">
      <div className="bg-gray-800 rounded-lg shadow-lg p-5">
        <h1 className="text-2xl font-bold text-white">Primer bloque qliao</h1>
      </div>

      <div className="grid grid-cols-4 grid-rows-6 gap-6">
        <MotionConfig transition={spring}>
          {Array(cards_number)
            .fill()
            .map((_, i) => (
              <OnReveal key={i} id={i}>
                <PBCard3DMove id={i} />
              </OnReveal>
            ))}
        </MotionConfig>
      </div>
    </main>
  );
}

export default App;
