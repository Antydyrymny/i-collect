import { Auth } from './auth';
import { Theme } from './theme';
import { Locale } from './locale';

function AllContexts({ children }: { children: React.ReactNode }) {
    return (
        <Auth>
            <Theme>
                <Locale>{children}</Locale>
            </Theme>
        </Auth>
    );
}

export default AllContexts;
