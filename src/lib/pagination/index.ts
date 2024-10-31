const getPagination = (searchParams: URLSearchParams, defaultPageSize = 10) => {
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const skip = (page - 1) * defaultPageSize;
  return { page, search, skip, take: defaultPageSize };
};

export default getPagination;
