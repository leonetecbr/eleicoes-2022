import { useContext } from 'react';
import { AppContext } from '../contexts';

const useApp = () => useContext(AppContext);

export default useApp;

export { useApp };
