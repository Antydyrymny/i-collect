import { Auth } from './auth';
import { Theme } from './theme';
import { Locale } from './locale';
import { ToastContainer } from 'react-toastify';
import { useThemeContext } from './theme';

function AllContexts({ children }: { children: React.ReactNode }) {
    const { theme } = useThemeContext();

    return (
        <Auth>
            <Theme>
                <Locale>
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
                </Locale>
            </Theme>
        </Auth>
    );
}

export default AllContexts;
