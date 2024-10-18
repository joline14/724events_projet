import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null); // Stockage des erreurs
  const [data, setData] = useState(null);  // Stockage des données récupérées
  const [last, setLast] = useState(null);   // Stockage du dernier événement


  const getData = useCallback(async () => {
    try {
      if(!data) {
      setData(await api.loadData());
      }
    } catch (err) {
      setError(err);
    }
  }, [data]);

   // Utiliser useEffect pour récupérer les données lors du montage
   useEffect(() => {
    getData(); // Récupérer les données dès que le composant est monté
  }, [getData]);

   // Mettre à jour `last` lorsque les données sont récupérées
   useEffect(() => {
    if (data && data.focus) {
      const recentEvent = data.focus.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      )[0];
      setLast(recentEvent); // Stocker le dernier événement
    }
  }, [data]);
  
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last 
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useData = () => useContext(DataContext);

export default DataContext;
