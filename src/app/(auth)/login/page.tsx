import LoginView from "@/components/views/Login";

const loginPage = ({ searchParams }: any) => {
  return (
    <div>
      <LoginView searchParams={searchParams} />
    </div>
  );
};

export default loginPage;
