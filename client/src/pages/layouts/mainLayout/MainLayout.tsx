import { Outlet } from 'react-router-dom';
import { ThemeSwitcher } from '../../../contexts/theme';
import { LocalePicker } from '../../../contexts/locale';

function MainLayout() {
    return (
        <div>
            <ThemeSwitcher />
            <LocalePicker />
            <Outlet />
        </div>
    );
}

export default MainLayout;
