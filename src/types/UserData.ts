export type UserData = {
  user: {
    username: string;
    realName: string;
    countryName: string;
    company: string;
    school: string;
    aboutMe: string;
    reputation: number;
    ranking: number;
  };
  plainAcSubmissions: {
    userId: number;
    username: string;
    difficulty: "All" | "Easy" | "Medium" | "Hard";
    count: number;
    submissions: number;
  }[];
  plainTotalSubmissions: {
    userId: number;
    username: string;
    difficulty: "All" | "Easy" | "Medium" | "Hard";
    count: number;
    submissions: number;
  }[];
};
