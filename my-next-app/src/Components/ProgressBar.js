import styles from "@/styles/ProgressBar.module.css";

const ProgressBar = ({ currentStep }) => {
   
  const steps = ["cart", "checkout", "confirmation"];
  const stepIndex = steps.indexOf(currentStep);
 
  const progressWidth = `${(stepIndex / (steps.length - 1)) * 100}%`;

  return (
    <div className={styles["progress-container"]}>
      
      <div className={styles["progress-line"]}></div>

       
      <div
        className={styles["progress-line-filled"]}
        style={{ width: progressWidth }}
      ></div>
 
      {steps.map((step, index) => (
        <div className={styles.step} key={step}>
          <span
            className={`${styles["step-title"]} ${
              index > stepIndex ? styles.pending : ""
            }`}
          >
            {step.charAt(0).toUpperCase() + step.slice(1)}
          </span>
          <div
            className={`${styles["step-circle"]} ${
              index > stepIndex ? styles.pending : ""
            }`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
