export interface Owner {
  name: string;
  experience: string;
  avatar?: string;
}

export interface Harvester {
  id: string;
  name: string;
  distance: string;
  price: string;
  perUnit: string;
  rating: string;
  jobs: string;
  year: string;
  image: string;
  status: 'available' | 'busy';
  workSpeed: string;
  estimatedTime: string;
  owner: Owner;
  isNew?: boolean;
}

export const HARVESTERS: Harvester[] = [
  {
    id: '1',
    name: 'John Deere S780 - Combine Harvester',
    distance: '2.4 km',
    price: '₹2,400',
    perUnit: '/ acre',
    rating: '4.9',
    jobs: '120+',
    year: '2023',
    status: 'available',
    workSpeed: '2 acres / hour',
    estimatedTime: '~3 hours',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLGvKSPRqo9QcOGgXchxQD_30CplkCQx8qPUdl1bxd9vA0beMT33oRij4EJJumWtMxMDR54FcYQ44CzO7NErxWKdTKXjl6uEHtsyTZNhBuy--gzwBMCou-sQZ8yyT7dbiS60NA412n383OSOboZDfVsxgFrve48F5MypV0KP5k2fxdEbu4rmPbyAIx_xF01MV0bxglqZwoxKXbiDml3ub_m4F5wdaJ_du2T-PXzJhSXLgx8sZxEnoXeudlgTBCu4efMnw0yK9AdEuZ',
    owner: {
      name: 'Sukhwinder Singh',
      experience: '10',
      avatar:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAFqKck4Fe8616474BV4F98u7iX1OKn85OJSDdB8YBMeAZd1dYY5O40xXBzVF7vaQTlf8VaGSToCalJHhiLZbSVUYgetmVO2ghk9YseWydSFjmZBh7pnpfW7eqvm_B4_wK7hXThBd6gkvYOBauQvwHKfhjk4zbFZvsLSxIErPCvFjzMvfpYP81sBQwZFSd5LekX60gQIPXr84ojIc5d-z5rfSTI3lUUePangojx1-Gpbs9ncXEtB8aHa-yE10pZolSdtV7h7kVDnUy3',
    },
  },
  {
    id: '2',
    name: 'Claas Lexion 8000 - Combine Harvester',
    distance: '5.8 km',
    price: '₹2,150',
    perUnit: '/ acre',
    rating: '4.7',
    jobs: '85+',
    year: '2022',
    status: 'available',
    workSpeed: '2.5 acres / hour',
    estimatedTime: '~2.5 hours',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxgXWIwn5gDEkC8bI9gpwW2UcSnFzjmtVcsv8PhX78zixp7X_yseh_Pt8ATCqaAZHpP5dsitLIT-BOAgBswmSqpyWoZ4rxsuSWM9Sy-4hvlyOtmppBhh0YcHMtd88og_SapDCP_nA6auIeTQMXvHyj8Td8Fcze3aImq19VMsMhbNA2n6n-Lz0P7pTWJsGlKWWFYiCcA3-jIFp8-OkjtPlwRaXI76F7ZwbjqGbZsSqUn7BqRyg_bS38QQJ0Ndn43-yzpvt2o-70FR0J',
    owner: {
      name: 'Gurpreet Dhaliwal',
      experience: '7',
    },
  },
  {
    id: '3',
    name: 'Mahindra Arjun 605 - Tractor',
    distance: '1.2 km',
    price: '₹1,800',
    perUnit: '/ acre',
    rating: 'New',
    jobs: '10+',
    year: '2024',
    status: 'available',
    workSpeed: '1.5 acres / hour',
    estimatedTime: '~4 hours',
    isNew: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD3oLI12PoO3BzgHmdcjntRW_dPOAqSzErCdFsUT3OcMwCrxycjzudVXcO4_X5U3QsGp5nC2VYafa0Xv-67bVQe6qSNR7_5qTL7eYlS1bvnA-I8bHhHDAL0mLjUcdcxQk8iHeCTGNDhYbSo5NWPWdHJWFPYOvUOWE0ljH8OFZQHJN_qClmEYNTo2xHzOXPOK8VTVdF9IGBRqNeom8Zdma6H_SQ7Ap3lNAonIQgA_NoR1S6g-1sGwszdlSh_ciQ2tUjfGonrtntckFVf',
    owner: {
      name: 'Ravinder Kumar',
      experience: '5',
    },
  },
];

export function getHarvesterById(id: string): Harvester | undefined {
  return HARVESTERS.find(h => h.id === id);
}
