import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/useAuthStore";
import Waves from './ui/Waves';


const SignUpPage = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [formError, setFormError] = useState("");
	const navigate = useNavigate();

	

	const { signup, error, isLoading } = useAuthStore();

	const handleSignUp = async (e) => {
		e.preventDefault();

		if (!name || !email || !password || !confirmPassword) {
			setFormError("Please fill out all fields.");
			return;
		}

		if (password !== confirmPassword) {
			
			setFormError("Passwords do not match");
			return;
		}

		
		setFormError("");

		try {
			await signup(email, password, name);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="max-w-md w-full">
			<Waves
			lineColor="#fff"
			backgroundColor="rgba(255, 255, 255, 0.2)"
			waveSpeedX={0.02}
			waveSpeedY={0.01}
			waveAmpX={40}
			waveAmpY={20}
			friction={0.9}
			tension={0.01}
			maxCursorMove={120}
			xGap={12}
			yGap={36}
			/>
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className=' bg-white bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-900 to-indigo-900 text-transparent bg-clip-text'>
					Create Account
				</h2>

				<form onSubmit={handleSignUp}>
					<Input
						icon={User}
						type='text'
						placeholder='Full Name'
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							setFormError("");
						}}
					/>
					<Input
						icon={Mail}
						type='email'
						placeholder='Email Address'
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setFormError("");
						}}
					/>
					<Input
						icon={Lock}
						type='password'
						placeholder='Password'
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setFormError("");
						}}
					/>
					<Input
						icon={Lock}
						type="password"
						placeholder="Confirm Password"
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.target.value);
							setFormError("");
						}}
					/>
					

					<PasswordStrengthMeter password={password} />
					{formError && (
						<p className="text-red-500 text-sm text-center mt-1">{formError}</p>
					)}
					{error && <p className='text-red-600 font-medium text-center mt-1'>{error}</p>}

					<motion.button
						className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
						font-bold rounded-lg shadow-lg hover:from-blue-600
						hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
						 focus:ring-offset-gray-900 transition duration-200'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type='submit'
						disabled={isLoading }
					>
						{isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-white bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-800'>
					Already have an account?{" "}
					<Link to={"/login"} className='text-blue-700 hover:underline'>
						Login
					</Link>
				</p>
			</div>
		</motion.div>
		</div>
	);
};
export default SignUpPage;
