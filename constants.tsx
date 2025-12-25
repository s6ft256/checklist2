import React from 'react';
import { 
  FileText, 
  Settings, 
  Activity, 
  Shield, 
  Anchor, 
  Layout, 
  Maximize, 
  Truck,
  Zap,
  Target
} from 'lucide-react';
import { DayOfWeek } from './types';

export interface ChecklistGroup {
  title: string;
  icon: React.ReactNode;
  items: string[];
  illustrationText?: string;
  illustrationType?: 'document' | 'mechanical' | 'safety' | 'hydraulic';
  illustrationUrl?: string;
  itemIllustrations?: Record<string, string | string[]>;
}

export const CHECKLIST_GROUPS: ChecklistGroup[] = [
  {
    title: 'Documentation & Monitoring',
    icon: <FileText className="w-5 h-5" />,
    items: [
      'Documents', 
      'Load Chart', 
      'Crane Manual', 
      'Load Monitor', 
      'Load Indicator Light', 
      'Anemometer Device'
    ],
    itemIllustrations: {
      'Documents': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1q6pW_nvDYtrnvHzl4JTaGL7L26IbAibkcw&s',
      'Load Chart': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCV99rV7SltqBzGrcQgXFEznNQX9lyp3gcyw&s',
      'Crane Manual': 'https://i.ebayimg.com/images/g/qLYAAOSw~5lluqxE/s-l225.jpg',
      'Load Monitor': 'https://5.imimg.com/data5/SELLER/Default/2022/3/JY/HH/HJ/63205549/crane-human-machine-interface-panel-indicator.png',
      'Load Indicator Light': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXPAcy62RJ69bbGEz9dywv_CxSmps0ZQMYBg&s',
      'Anemometer Device': 'https://upload.wikimedia.org/wikipedia/commons/6/61/Wea00920.jpg'
    }
  },
  {
    title: 'Engine & Hydraulic Systems',
    icon: <Settings className="w-5 h-5" />,
    items: [
      'Engine Condition', 
      'Hydraulic System', 
      'Hydraulic Hoses / Cylinder Condition', 
      'Oil Leak', 
      'Fuel Tank', 
      'Battery Condition'
    ],
    itemIllustrations: {
      'Engine Condition': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv9lO_wE5H9w3H8H4H4H4H4H4H4H4H4H4H4&s',
      'Hydraulic System': 'https://www.evengineeringonline.com/wp-content/uploads/2025/06/MUST-Danfoss-SANY-eHydraulics-system-1.jpg',
      'Oil Leak': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvO05cDWvho1iRa0XtN5B6vthKFwz2DmuVpQ&s',
      'Hydraulic Hoses / Cylinder Condition': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVh6Y4BRi1vK-8pYghRS-zuejFHtrSZWZs5g&s',
      'Fuel Tank': 'https://perfion-api.hmfcranes.com/Perfion/Image.aspx?size=800x800&format=png&id=896e401e-d4ff-4a62-b7fd-8f37d1ff5bf8',
      'Battery Condition': 'https://www.clausenautomotive.com/images/battery_replaced.jpeg'
    }
  },
  {
    title: 'Operator Cabin & Controls',
    icon: <Layout className="w-5 h-5" />,
    items: [
      'Operator Cabin', 
      'Breaking System', 
      'Gauges', 
      'Seat Belt', 
      'Horn system', 
      'Beacon / Reverse Alarm', 
      'Head & Rear light'
    ],
    itemIllustrations: {
      'Operator Cabin': 'https://img.linemedia.com/img/s/construction-equipment-all-terrain-crane-Grove-GMK6300L---1656315573644502903_big--22062710371729738700.jpg',
      'Breaking System': 'https://i.pinimg.com/736x/b6/52/e8/b652e80663c217aa6969ead03d703491.jpg',
      'Gauges': 'https://i.pinimg.com/736x/4c/71/22/4c71228012991582b96d6179f9f406b1.jpg',
      'Seat Belt': 'https://i.pinimg.com/736x/5f/a1/fe/5fa1fe56adfd6623393034e3e3587951.jpg',
      'Horn system': 'https://i.pinimg.com/1200x/69/5e/60/695e608983cded6e57e00f346d897767.jpg',
      'Beacon / Reverse Alarm': [
        'https://i.pinimg.com/1200x/44/06/c5/4406c54a504622f4b51a86cdae6d0c98.jpg',
        'https://m.media-amazon.com/images/I/61NeDw4RO6L.jpg'
      ],
      'Head & Rear light': [
        'https://i.pinimg.com/1200x/86/a1/56/86a1562533e96ee94bff44a0afa84d04.jpg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1BNOEcnPHHFX94qTHGYTQ0C0EfUPlo5ssMA&s'
      ]
    }
  },
  {
    title: 'Lifting Gear & Winch',
    icon: <Anchor className="w-5 h-5" />,
    items: [
      'Hook Block & safety Latch', 
      'Wedge Socket & Wire Rope', 
      'Sheaves', 
      'Anti-Two Block Devices', 
      'Winch & Spooling', 
      'Wire Rope Guide Roller'
    ],
    itemIllustrations: {
      'Hook Block & safety Latch': 'https://i.pinimg.com/1200x/0d/2c/27/0d2c276f62270325d77a92dce812725a.jpg',
      'Wedge Socket & Wire Rope': 'https://i.pinimg.com/1200x/79/f4/f8/79f4f8d6c1f7fc237d280db336417dea.jpg',
      'Sheaves': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_M9m0zUoP8m9f7p0L2P8v4e3o6g&s',
      'Anti-Two Block Devices': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV2hOc-ssP6mF7CVR4W6s3oMHDyHsF4gaFCg&s',
      'Winch & Spooling': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Seiltrommeln1.jpg',
      'Wire Rope Guide Roller': 'https://5.imimg.com/data5/SELLER/Default/2022/9/OK/MJ/XF/28397680/40-hrc-steel-rope-guide-500x500.jpg'
    }
  },
  {
    title: 'Stability & Chassis',
    icon: <Maximize className="w-5 h-5" />,
    items: [
      'Outrigger Jack', 
      'Outrigger Pad / Mat', 
      'Outriggers Control System', 
      'Level Indicator', 
      'Moving Parts', 
      'Tires', 
      'Crawler Track'
    ],
    itemIllustrations: {
      'Outrigger Jack': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsn3AG2fWwNf4pO6r_jSkG_0zgPsIPBdEp3A&s',
      'Outrigger Pad / Mat': 'https://www.universal-crane-mats.com/s/cc_images/teaserbox_2460499870.JPG?t=1433764099',
      'Outriggers Control System': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQshXt3RPGiSgcwASs1_edRHI4kI5wf24di7A&s',
      'Level Indicator': 'https://cpimg.tistatic.com/06999053/b/5/Level-Indicator.jpg',
      'Moving Parts': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4o6hJQDJBJBu3NLwItu6u9tuwQury5GDyzw&s',
      'Tires': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS15a8ecooEGCAxIIvYsVCNiDeV6qXntV4jQg&s',
      'Crawler Track': 'https://cdn-iblgd.nitrocdn.com/QogvuDDXMoieZBwcPtABrhlKzcZVNilK/assets/images/optimized/rev-b7d3648/www.valuecrane.com/wp-content/uploads/2024/05/crawler-track-undercarriage-02.jpg'
    }
  },
  {
    title: 'Boom, Jib & Safety',
    icon: <Target className="w-5 h-5" />,
    items: [
      'Boom Angle Indicator', 
      'Telescopic Boom', 
      'Lattice Boom', 
      'Fly Jib', 
      'Counterweight', 
      'Side Mirrors', 
      'Fire Extinguisher'
    ],
    itemIllustrations: {
      'Boom Angle Indicator': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2WI5Y85MOLPX20ohcUYRIzcvFKq5a0utOxQ&s',
      'Telescopic Boom': 'https://www.sanyamerica.com/wp-content/uploads/2025/02/crane-600x600.jpg',
      'Lattice Boom': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQftPu81DQ3nUZ55ObzhQf-3enMJ3wtns2HuQ&s',
      'Fly Jib': 'https://5.imimg.com/data5/SELLER/Default/2022/3/YH/RQ/QJ/2200754/fly-jib-extension-jib-mobile-crane.jpg',
      'Counterweight': 'https://www.farinia.com/sites/default/files/styles/435x250_croped/public/images/2020/offhighway-tp-visual-comp-crane-web.jpg?itok=VMrWtJO8',
      'Side Mirrors': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5rKmOHxu_vhu2Si2q9m-fJqN54FR0KBgLjw&s',
      'Fire Extinguisher': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0v-jjE6-XtWTtSgbwdqIWgcDMoVaxSOQwBg&s'
    }
  }
];

export const DAYS: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];