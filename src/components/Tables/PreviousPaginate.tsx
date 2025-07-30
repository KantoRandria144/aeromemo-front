interface PreviousPaginateProps {
    actualPage: number;
    setActualPage: (page: number) => void;
  }
  
  function PreviousPaginate({ actualPage, setActualPage }: PreviousPaginateProps) {
    if (actualPage <= 1) return null;
  
    return (
      <div
        className="cursor-pointer"
        onClick={() => setActualPage(actualPage - 1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </div>
    );
  }
  
  export default PreviousPaginate;
  