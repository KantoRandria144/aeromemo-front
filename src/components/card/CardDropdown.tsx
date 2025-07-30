const CardDropdown = () => {
    return (
        <>
            <div className="relative w-full">
                <div className="py-5 px-4 rounded-xl shadow-md bg-white dark:bg-strokedark transition-all duration-300 border-opacity-80 hover:shadow-xl cursor-pointer flex justify-between items-center gap-4py-4 px-3 rounded-lg shadow-md bg-white dark:bg-strokedark transition-all duration-300 border-opacity-80 hover:shadow-lg cursor-pointer flex justify-between items-center gap-4">
                    <div>
                        <div className="text-lg font-semibold text-slate-800 dark:text-white">
                            <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            id="Layer_1" data-name="Layer 1" 
                            viewBox="0 0 24 24" 
                            width="18" 
                            height="18">
                            <path d="M24,10V24H0V10Zm0-2V5a3,3,0,0,0-3-3H18V0H16V2H8V0H6V2H3A3,3,0,0,0,0,5V8Zm-6,6H16v2h2Zm-5,0H11v2h2ZM8,14H6v2H8Zm10,4H16v2h2Zm-5,0H11v2h2ZM8,18H6v2H8Z"/>
                            </svg>
                            Réunion de la journée
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default CardDropdown;