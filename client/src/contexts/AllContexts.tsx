import { Auth } from './auth';
import { Theme } from './theme';
import { Locale } from './locale';
import { Toast } from './Toast';

function AllContexts({ children }: { children: React.ReactNode }) {
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
