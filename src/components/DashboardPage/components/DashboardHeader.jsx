
export const DashboardHeader = () => {
  return (
    <div className="bg-slate-800/30 backdrop-blur-xl px-4 py-3 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Container - Ahora a la derecha */}
        <div className="flex justify-end">
          {" "}
          {/* Cambiado el orden y justificación */}
          <img
            src="https://camper-stories.s3.us-east-2.amazonaws.com/assets/CampusLogo.png"
            alt="Campus Logo"
            className="object-contain h-10 w-32 sm:h-11 sm:w-40 lg:h-12 lg:w-60"
          />
        </div>

        
      </div>
    </div>
  )
}

