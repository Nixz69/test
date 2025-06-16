export interface Threat {
  id: number;
  name: string;
  description: string;
  image: string;
  price:number;

}

export interface CartItem extends Threat {
  quantity?: number;
}

export interface User {
  id: number;
  username: string;
  email?: string;
  avatar?: string;
  is_staff?: boolean;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  image: string;
  is_deleted?: boolean;
  price:number;

}

export interface ApplicationService {
  id: number;
  service: number | Service;
  application: number | Application;
  quantity?: number;
}

export interface Application {
  id: number;
  status: 'draft' | 'formatted' | 'completed' | 'rejected' | string;
  created_at: string;
  user: User;
  moderator?: User | null;
  image?: string;
  services?: ApplicationService[];
  is_deleted?: boolean;
  generated_at?: string;
  completed_at?: string | null; // Добавляем возможность null
}

export interface AuthPageProps {
  onLogin: (token: string) => void;
  onRegister?: (token: string) => void;
  goBack: () => void;
}

export interface RegisterPageProps {
  onRegister: (token: string) => void;
  goBack: () => void;
}

export interface ThreatDetailsProps {
  threat: Threat;
  goToBack: () => void;
}

export interface ThreatCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  showDetails: () => void;
  onAddToCart: () => void;
}

export interface TwoSlideProps {
  showDetails: (threat: Threat) => void;
  goToThreeSlide: () => void;
  addToCart: (item: Threat) => void;
}