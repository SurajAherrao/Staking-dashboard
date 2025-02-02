import {  useEffect } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

export default function MiniKitProvider({ children }) {
	useEffect(() => {
		MiniKit.install()
	}, [])

	return <>{children}</>
}