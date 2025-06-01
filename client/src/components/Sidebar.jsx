import { NavLink } from 'react-router-dom'
import {
    DiscoverSquareIcon,
    Folder01Icon,
    Link01Icon,
    Menu01Icon,
    Settings01Icon,
    StarIcon,
    TagsIcon,
} from 'hugeicons-react'

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
    return (
        <aside
            className={`fixed md:static top-0 left-0 z-20 h-full w-64 md:w-56 bg-white dark:bg-neutral-900 border-r border-slate-200 dark:border-neutral-700 
        flex-col overflow-y-auto transition-transform duration-300 md:flex
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        >
            {/* Header */}
            <div className="h-12 flex items-center justify-between px-4 border-b border-slate-200 dark:border-neutral-700">
                <p className="text-lg font-semibold text-slate-800 dark:text-neutral-200">LinkVault</p>
                <button
                    className="md:hidden p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 dark:text-neutral-200"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    title="Toggle Menu"
                >
                    <Menu01Icon size={18} />
                </button>
            </div>

            {/* Links */}
            <ul className="px-2 pt-4 space-y-1">
                {[
                    { to: '/links', label: 'Links', icon: Link01Icon },
                    { to: '/categories', label: 'Categories', icon: Folder01Icon },
                    { to: '/tags', label: 'Tags', icon: TagsIcon },
                    { to: '/favorite', label: 'Favourite', icon: StarIcon },
                    { to: '/settings', label: 'Settings', icon: Settings01Icon },
                ].map(({ to, label, icon: Icon }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            className={({ isActive }) =>
                                `group px-4 py-2 flex items-center gap-3 rounded-md transition-all cursor-pointer ${isActive
                                    ? 'bg-slate-100 text-blue-600 dark:bg-neutral-800'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-neutral-800'
                                }`
                            }
                            onClick={() => setIsMenuOpen(false)} // close menu on mobile after click
                        >
                            <Icon size={18} className="group-hover:stroke-blue-600" />
                            <span className="text-sm font-medium">{label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </aside>
    )
}

export default Sidebar
