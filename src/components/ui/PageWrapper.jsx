import { motion } from 'framer-motion'
import { pageVariants, pageTransition } from '../../lib/animations'

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}

export default PageWrapper