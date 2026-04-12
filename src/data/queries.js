const QUERIES_STORAGE_KEY = 'fw_queries_v1';

export const getQueries = () => {
  const data = localStorage.getItem(QUERIES_STORAGE_KEY);
  if (data) return JSON.parse(data);
  
  localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify([]));
  return [];
};

export const addQuery = (queryData) => {
  const queries = getQueries();
  const newQuery = {
    ...queryData,
    id: Date.now(),
    timestamp: new Date().toISOString()
  };
  queries.unshift(newQuery); // add to top
  localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify(queries));
  return newQuery;
};

export const deleteQuery = (id) => {
  let queries = getQueries();
  queries = queries.filter(q => q.id !== id);
  localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify(queries));
};
