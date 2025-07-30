import NextPaginate from "./NextPaginate";
import PreviousPaginate from "./PreviousPaginate";

interface PaginationProps {
  actualPage: number;
  setActualPage: (page: number) => void;
  pageNumbers: number;
}

function Pagination({
  actualPage,
  setActualPage,
  pageNumbers,
}: PaginationProps) {
  const generatePagination = () => {
    const paginationLists = [];
    // const middlePage = Math.ceil(pageNumbers / 2);
    if (pageNumbers === 0) {
      paginationLists.push(<></>);
      return paginationLists;
    }

    if (pageNumbers === 1) {
      paginationLists.push(
        <span
          className={`${
            actualPage === 1
              ? "font-black bg-gray dark:bg-graydark dark:text-white"
              : ""
          } h-9 w-8 flex border border-bodydark2 dark:border-form-strokedark place-items-center justify-center cursor-pointer rounded-md`}
          key={1}
          onClick={() => setActualPage(1)}
        >
          1
        </span>
      );
      return paginationLists;
    }

    // Always show the first page
    paginationLists.push(
      <span
        className={`${
          actualPage === 1
            ? "font-black bg-gray dark:bg-graydark dark:text-white"
            : ""
        } h-8 w-8 flex border border-bodydark2 dark:border-form-strokedark place-items-center justify-center cursor-pointer rounded-md`}
        key={paginationLists.length + 1}
        onClick={() => setActualPage(1)}
      >
        1
      </span>
    );

    // Show "..." after the first page if needed
    if (actualPage > 3) {
      paginationLists.push(
        <span
          className="h-8 w-8 flex place-items-center justify-center"
          key={"first-ellipsis"}
        >
          ...
        </span>
      );
    }

    // Show the previous page if it's not the first page
    if (actualPage > 2) {
      paginationLists.push(
        <span
          className={`${
            actualPage === actualPage - 1
              ? "font-black bg-gray dark:bg-graydark dark:text-white"
              : ""
          } h-8 w-8 flex border border-bodydark2 dark:border-form-strokedark place-items-center justify-center cursor-pointer rounded-md`}
          key={paginationLists.length + 1}
          onClick={() => setActualPage(actualPage - 1)}
        >
          {actualPage - 1}
        </span>
      );
    }

    // Show the current page
    if (actualPage > 1 && actualPage < pageNumbers) {
      paginationLists.push(
        <span
          className={`font-black bg-gray dark:bg-graydark dark:text-white h-8 w-8 flex border border-bodydark2 dark:border-form-strokedark place-items-center justify-center cursor-pointer rounded-md`}
          key={paginationLists.length + 1}
          onClick={() => setActualPage(actualPage)}
        >
          {actualPage}
        </span>
      );
    }

    // Show the next page if it's not the last page
    if (actualPage < pageNumbers - 1) {
      paginationLists.push(
        <span
          className={`${
            actualPage === actualPage + 1
              ? "font-black bg-gray dark:bg-graydark dark:text-white"
              : ""
          } h-8 w-8 flex border border-bodydark2 dark:border-form-strokedark place-items-center justify-center cursor-pointer rounded-md`}
          key={paginationLists.length + 1}
          onClick={() => setActualPage(actualPage + 1)}
        >
          {actualPage + 1}
        </span>
      );
    }

    // Show "..." before the last page if needed
    if (actualPage < pageNumbers - 2) {
      paginationLists.push(
        <span
          className="h-8 w-8 flex place-items-center justify-center"
          key={"last-ellipsis"}
        >
          ...
        </span>
      );
    }

    // Always show the last page
    paginationLists.push(
      <span
        className={`${
          actualPage === pageNumbers
            ? "font-black bg-gray dark:bg-graydark dark:text-white"
            : ""
        } h-8 w-8 flex border border-bodydark2 dark:border-form-strokedark place-items-center justify-center cursor-pointer rounded-md`}
        key={paginationLists.length + 1}
        onClick={() => setActualPage(pageNumbers)}
      >
        {pageNumbers}
      </span>
    );

    return paginationLists;
  };

  return (
    <div className="py-4 px-2 flex space-x-2 place-items-center justify-end">
      <div className="flex space-x-1 place-items-center">
        <PreviousPaginate
          actualPage={actualPage}
          setActualPage={setActualPage}
        />
        {generatePagination()}
        <NextPaginate
          actualPage={actualPage}
          setActualPage={setActualPage}
          pageNumbers={pageNumbers}
        />
      </div>
    </div>
  );
}

export default Pagination;
