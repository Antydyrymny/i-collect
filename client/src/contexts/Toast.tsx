import { ToastContainer } from 'react-toastify';
import { useThemeContext } from './theme';

export function Toast({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeContext();

    return (
        <>
            <ToastContainer
                position='top-center'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={theme}
            />
            {children}
        </>
    );
}
