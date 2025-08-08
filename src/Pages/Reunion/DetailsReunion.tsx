const DetailsReunion = () => {
    return (
        <>
        <div className="grid px-7">
            <div className="text-center">DU : {new Date().toLocaleString()}</div>
            <div className="space-y-10">
                {/* ===== LEFT PART START */}
                    <div className="space-y-8"> 
                        {/* ===== INFO GENERAL START =====*/}
                        <div className="space-y-2 ">
                            <h1 className="font-bold  text-zinc-400 text-xl md:text-2xl ">
                                INFORMATION GENERALE
                            </h1>
                        </div>
                        {/* ===== INFO GENERAL END =====*/}
                    </div>
                {/* ===== LEFT PART END */}
            </div>
        </div>
        </>
    )
};

export default DetailsReunion;