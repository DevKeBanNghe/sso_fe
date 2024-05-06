import { store } from 'reduxApp/store';
import { Provider } from 'react-redux';
import AppRouter from 'routers/AppRouter';
import { ReactToastify } from 'components/shared/ReactToastify';
import 'configs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();
const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
    <ReactToastify />
  </Provider>
);
export default App;
