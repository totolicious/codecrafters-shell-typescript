function writeAsync(stream: NodeJS.WritableStream, chunk: string) {
  return new Promise<void>((resolve, reject) => {
    const ok = stream.write(chunk, (err) => {
      if (err) reject(err);
      else resolve();
    });

    if (ok) {
      resolve();
    } else {
      stream.once("drain", resolve);
    }
  });
}

export const ringBell = async () => {
  await writeAsync(process.stderr, "\x07");
};
