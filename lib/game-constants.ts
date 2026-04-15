export type KnnLevel = {
  id: string
  title: string
  datasetShape: "linear" | "circle" | "spiral"
  numClasses: number
  targetAccuracy: number
  xp: number
  hint: string
}

export type NeuralLiteLevel = {
  id: string
  title: string
  datasetShape: "linear" | "circle" | "xor"
  maxLayersAllowed: number
  xp: number
  hint: string
}

export const GAME_LEVELS = {
  knn: [
    {
      id: "knn-1",
      title: "Clear Divide",
      datasetShape: "linear",
      numClasses: 2,
      targetAccuracy: 90,
      xp: 50,
      hint: "Start with K=3."
    },
    {
      id: "knn-2",
      title: "The Bullseye",
      datasetShape: "circle",
      numClasses: 2,
      targetAccuracy: 85,
      xp: 75,
      hint: "A smaller K might capture the inner circle better."
    },
    {
      id: "knn-3",
      title: "Noisy Neighbors",
      datasetShape: "spiral",
      numClasses: 3,
      targetAccuracy: 80,
      xp: 120,
      hint: "Increase K to smooth out the noise."
    }
  ] as KnnLevel[],
  neural_lite: [
    {
      id: "nl-1",
      title: "Basic Separation",
      datasetShape: "linear",
      maxLayersAllowed: 1,
      xp: 50,
      hint: "You only need one layer for a straight line."
    },
    {
      id: "nl-2",
      title: "The Circle Problem",
      datasetShape: "circle",
      maxLayersAllowed: 2,
      xp: 75,
      hint: "You need hidden layers to bend the decision boundary."
    },
    {
      id: "nl-3",
      title: "XOR Matrix",
      datasetShape: "xor",
      maxLayersAllowed: 2,
      xp: 150,
      hint: "Use ReLU activation to solve the classic XOR problem."
    }
  ] as NeuralLiteLevel[]
}
