
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

        {/* Botón de inscripción - Ahora centrado */}
        <div className="flex justify-end">
          {" "}
          {/* Contenedor centrado */}
          <a
            href="https://miniurl.cl/RegistroCampuslands"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-cyan-400 
                     hover:bg-cyan-400/90 text-slate-900 
                     px-3 sm:px-4 lg:px-6 
                     py-1.5 sm:py-2
                     text-sm lg:text-base
                     rounded-lg font-medium
                     whitespace-nowrap
                     relative 
                     before:absolute before:inset-0 
                     before:-z-10 before:blur-lg before:rounded-lg
                     before:bg-gradient-to-r before:from-cyan-300 
                     before:via-cyan-400 before:to-cyan-500
                     before:transition-all before:duration-300 
                     before:hover:blur-xl
                     transform hover:scale-105 transition-transform duration-200"
          >
            <span className="hidden sm:inline">Inscríbete ahora</span>
            <span className="sm:hidden">Inscríbete</span>
          </a>
        </div>
      </div>
    </div>
  )
}

