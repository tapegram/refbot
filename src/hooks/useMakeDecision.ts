function useMakeDecision() {
  const [decision, setDecision] = useState<boolean | null>(null);

  const makeDecision = useCallback(() => {
    setDecision(Math.random() > 0.5);
  }, []);

  return { decision, makeDecision };
}
