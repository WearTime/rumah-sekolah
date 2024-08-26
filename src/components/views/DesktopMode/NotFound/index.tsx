import styles from "./NotFound.module.scss";
const NotFoundView = () => {
  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <p>We Couldn&apos;t Find this page</p>
    </div>
  );
};

export default NotFoundView;
