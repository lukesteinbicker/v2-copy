import { useState } from 'react'

export default function TestMenu() {
  const [isOpen, setIsOpen] = useState(false)
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Button clicked')
    setIsOpen(!isOpen)
  }
  
  return (
    <div className="relative">
      <button 
        type="button"
        onClick={handleClick}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
      >
        Test Button
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-background border border-border rounded-md">
          Menu is open!
        </div>
      )}
    </div>
  )
} 