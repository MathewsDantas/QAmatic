const PageContainer = ({ maxWidth = 800, children }) => {
  return (
    <div
      style={{
        maxWidth,
        margin: '32px auto',
        padding: '0 24px 48px',
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;
