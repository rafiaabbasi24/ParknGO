"use client"

import {HashLink as Link} from "react-router-hash-link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </motion.div>
    </div>
  )
}