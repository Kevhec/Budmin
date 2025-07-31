import {
  ChevronDown, LogOut, Menu, Moon, Settings, User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@budmin/ui/shadcn/dropdown-menu';
import {
  Button,
} from '@budmin/ui/shadcn/button';
import {
  Avatar, AvatarFallback/* , AvatarImage */,
} from '@budmin/ui/shadcn/avatar';
import {
  Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger,
} from '@budmin/ui/shadcn/sheet';
import Navigation from './Navigation';
import Footer from './Footer';
/* import { SidebarTrigger } from './ui/sidebar'; */

function Header({ ...props }) {
  const { state, logout } = useAuth();
  const navigation = useNavigate();
  const [avatarFallback, setAvatarFallback] = useState<string>('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false);
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (state.user && state.user.username) {
      const { username } = state.user;
      const usernameWordSplit = username.trim().toUpperCase().split(' ');
      const singleWord = usernameWordSplit.length === 1;

      let newAvatarFallback;

      if (singleWord) {
        newAvatarFallback = usernameWordSplit[0][0] + usernameWordSplit[0][1];
      } else {
        newAvatarFallback = usernameWordSplit[0][0] + usernameWordSplit[1][0];
      }

      setAvatarFallback(newAvatarFallback);
    }
  }, [state.user]);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleDropdown = (isOpen: boolean) => {
    setIsProfileDropdownOpen(isOpen);
  };

  const handleLogOutUser = () => {
    logout();
    navigation('/');
  };

  const userDropdownArrowClasses = cn('transition-transform', {
    '-rotate-180': isProfileDropdownOpen,
  });

  return (
    <header className="px-4 py-4 gap-x-2 bg-white flex justify-between items-center" {...props}>
      <Sheet open={open} onOpenChange={setOpen}>
        {/* <SidebarTrigger /> */}
        <SheetTrigger asChild>
          <Button variant="outline" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t('app.sidebarSheet.trigger')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs flex flex-col justify-between font-openSans bg-[#343A40] text-white border-none">
          <div>
            <SheetTitle className="sr-only">{t('app.sidebarSheet.title')}</SheetTitle>
            <SheetDescription className="sr-only">{t('app.sidebarSheet.description')}</SheetDescription>
            <p className="text-3xl font-semibold mb-32 font-openSans">Budmin</p>
            <Navigation />
          </div>
          <Footer />
        </SheetContent>
      </Sheet>
      <p className="flex-1">
        { t('app.header.greeting') }
        {' '}
        <span className="font-bold">
          {state.user?.username || ''}
        </span>
      </p>
      <DropdownMenu onOpenChange={handleDropdown}>
        <DropdownMenuTrigger className="flex gap-x-1 items-center">
          <Avatar>
            {/* <AvatarImage /> */}
            <AvatarFallback>
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className={userDropdownArrowClasses} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            {t('app.userMenu.label')}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 w-4 h-4" />
              <span>{t('app.userMenu.profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Moon className="mr-2 w-4 h-4" />
              <span>{t('app.userMenu.darkMode')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 w-4 h-4" />
              <span>{t('app.userMenu.options')}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogOutUser}>
            <Button asChild>
              <>
                <LogOut className="mr-2 w-4 h-4" />
                <span>{t('app.userMenu.signOut')}</span>
              </>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default Header;
