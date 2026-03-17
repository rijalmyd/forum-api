class LikeRepository {
  async addLikeComment(commentId, userId) { // eslint-disable-line no-unused-vars
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteLikedComment(commentId, userId) { // eslint-disable-line no-unused-vars
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async isLikedComment(commentId, userId) { // eslint-disable-line no-unused-vars
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async getLikeCountsByCommentIds(commentIds) { // eslint-disable-line no-unused-vars
    throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

export default LikeRepository;