
export const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const staggerContainer = (delayChildren: number = 0.05, staggerChildren: number = 0.1) => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren,
      staggerChildren
    }
  }
});

export const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const slideIn = (direction: "up" | "down" | "left" | "right", delay: number = 0) => {
  const transformValues = {
    up: "translateY(100%)",
    down: "translateY(-100%)",
    left: "translateX(100%)",
    right: "translateX(-100%)"
  };

  return {
    hidden: {
      transform: transformValues[direction],
      opacity: 0
    },
    visible: {
      transform: "translate(0)",
      opacity: 1,
      transition: {
        delay,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
};

export const scaleUp = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

export const shimmer = {
  hidden: {
    backgroundPosition: "0% 0%"
  },
  visible: {
    backgroundPosition: "100% 0%",
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  }
};

export const pageTransition = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.3
    }
  }
};

export const rotateIn = {
  hidden: { rotateY: 90, opacity: 0 },
  visible: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const revealText = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export const drawPath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1, ease: "easeInOut" },
      opacity: { duration: 0.5 }
    }
  }
};

export const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut"
    }
  }
};

export const blurIn = {
  hidden: { 
    filter: "blur(20px)",
    opacity: 0
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};
