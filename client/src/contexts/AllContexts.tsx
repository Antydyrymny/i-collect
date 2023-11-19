import { Auth } from './auth';
import { Theme } from './theme';
import { Locale } from './locale';
import { Toast } from './Toast';
import { useScrollToTop } from '../hooks';

function AllContexts({ children }: { children: React.ReactNode }) {
    useScrollToTop();

    return (
        <Auth>
            <Theme>
                <Locale>
                    <Toast>{children}</Toast>
                </Locale>
            </Theme>
        </Auth>
    );
}

export default AllContexts;
