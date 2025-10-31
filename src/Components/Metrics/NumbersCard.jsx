import { motion } from "framer-motion";
import '../../App.css'

const NumbersCard = ({ name, icon: Icon, value, color }) => {
	return (
		<motion.div
		className={`backgroundPrimaryDark  bg-opacity-50 backdrop-blur-md overflow-hidden shadow-lg rounded-xl border border-primaryDark `}
			whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
		>
			<div className='px-4 py-5 sm:p-6'>
				<span className='flex items-center text-sm font-medium textColor'>
					<Icon size={20} className='mr-2' style={{ color }} />
					{name}
				</span>
				<p className='mt-1 text-3xl font-semibold textColor'>{value}</p>
			</div>
		</motion.div>
	);
};
export default NumbersCard;