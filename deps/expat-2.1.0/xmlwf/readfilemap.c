/* Copyright (c) 1998, 1999 Thai Open Source Software Center Ltd
   See the file COPYING for copying permission.
*/

#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdlib.h>
#include <stdio.h>

/* Functions close(2) and read(2) */
#if ! defined(_WIN32) && ! defined(_WIN64)
#  include <unistd.h>
#endif

/* Function "read": */
#if defined(_MSC_VER)
#  include <io.h>
/* https://msdn.microsoft.com/en-us/library/wyssk1bs(v=vs.100).aspx */
#  define _EXPAT_read _read
#  define _EXPAT_read_count_t int
#  define _EXPAT_read_req_t unsigned int
#else /* POSIX */
/* http://pubs.opengroup.org/onlinepubs/009695399/functions/read.html */
#  define _EXPAT_read read
#  define _EXPAT_read_count_t ssize_t
#  define _EXPAT_read_req_t size_t
#endif

#ifdef __BEOS__
#include <unistd.h>
#endif

#ifndef S_ISREG
#ifndef S_IFREG
#define S_IFREG _S_IFREG
#endif
#ifndef S_IFMT
#define S_IFMT _S_IFMT
#endif
#define S_ISREG(m) (((m) & S_IFMT) == S_IFREG)
#endif /* not S_ISREG */

#ifndef O_BINARY
#ifdef _O_BINARY
#define O_BINARY _O_BINARY
#else
#define O_BINARY 0
#endif
#endif

#include "filemap.h"

int
filemap(const char *name,
        void (*processor)(const void *, size_t, const char *, void *arg),
        void *arg)
{
  size_t nbytes;
  int fd;
  int n;
  struct stat sb;
  void *p;

  fd = open(name, O_RDONLY|O_BINARY);
  if (fd < 0) {
    perror(name);
    return 0;
  }
  if (fstat(fd, &sb) < 0) {
    perror(name);
    close(fd);
    return 0;
  }
  if (!S_ISREG(sb.st_mode)) {
    fprintf(stderr, "%s: not a regular file\n", name);
    close(fd);
    return 0;
  }
  nbytes = sb.st_size;
  /* malloc will return NULL with nbytes == 0, handle files with size 0 */
  if (nbytes == 0) {
    static const char c = '\0';
    processor(&c, 0, name, arg);
    close(fd);
    return 1;
  }
  p = malloc(nbytes);
  if (!p) {
    fprintf(stderr, "%s: out of memory\n", name);
    close(fd);
    return 0;
  }
  n = read(fd, p, nbytes);
  if (n < 0) {
    perror(name);
    free(p);
    close(fd);
    return 0;
  }
  if (n != nbytes) {
    fprintf(stderr, "%s: read unexpected number of bytes\n", name);
    free(p);
    close(fd);
    return 0;
  }
  processor(p, nbytes, name, arg);
  free(p);
  close(fd);
  return 1;
}
