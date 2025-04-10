import useDataStore from './src/store/tempDataStore.js';

const store = useDataStore;
store.getState().createCheckpoint();
