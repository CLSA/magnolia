<?php
/**
 * module.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 * @filesource
 */

namespace magnolia\service\review;
use cenozo\lib, cenozo\log, magnolia\util;

/**
 * Performs operations which effect how this module is used in a service
 */
class module extends \cenozo\service\module
{
  /**
   * Extend parent method
   */
  public function validate()
  {
    parent::validate();
    $db_role = lib::create( 'business\session' )->get_role();

    // restrict some review-types to certain roles
    if( 300 > $this->get_status()->get_code() )
    {
      if( 'PATCH' == $this->get_method() )
      {
        $db_review = $this->get_resource();
        if( !is_null( $db_review ) )
        {
          $review_type = $this->get_resource()->get_review_type()->name;
          if( 'administrator' != $db_role->name )
          {
            if( 'Admin' == $review_type || 'SAC' == $review_type ) $this->get_status()->set_code( 403 );
            else if( 'Reviewer 1' == $review_type || 'Reviewer 2' == $review_type )
            {
              if( 'reviewer' != $db_role->name && 'chair' != $db_role->name ) $this->get_status()->set_code( 403 );
            }
            else if( 'Chair' == $review_type || 'Second Chair' == $review_type )
            {
              if( 'chair' != $db_role->name ) $this->get_status()->set_code( 403 );
            }
            else if( 'SMT' == $review_type || 'Second SMT' == $review_type )
            {
              if( 'smt' != $db_role->name ) $this->get_status()->set_code( 403 );
            }
          }
        }
      }
    }
  }

  /**
   * Extend parent method
   */
  public function prepare_read( $select, $modifier )
  {
    parent::prepare_read( $select, $modifier );

    $session = lib::create( 'business\session' );
    $db_user = $session->get_user();
    $db_role = $session->get_role();

    $modifier->join( 'review_type', 'review.review_type_id', 'review_type.id' );
    $modifier->left_join( 'user', 'review.user_id', 'user.id' );
    $modifier->left_join( 'recommendation_type', 'review.recommendation_type_id', 'recommendation_type.id' );
    $modifier->join( 'reqn', 'review.reqn_id', 'reqn.id' );
    $modifier->join( 'reqn_current_reqn_version', 'reqn.id', 'reqn_current_reqn_version.reqn_id' );
    $modifier->join( 'reqn_version', 'reqn_current_reqn_version.reqn_version_id', 'reqn_version.id' );

    if( !is_null( $this->get_resource() ) )
    {
      // include the requisition identifier and user first/last/name as supplemental data
      $select->add_column( 'reqn.identifier', 'formatted_identifier', false );
      $select->add_column( 'CONCAT( user.first_name, " ", user.last_name, " (", user.name, ")" )', 'formatted_user_id', false );
    }

    if( $select->has_column( 'user_full_name' ) )
      $select->add_column( 'CONCAT( user.first_name, " ", user.last_name )', 'user_full_name', false );

    // restrict reviewers to seeing their own "reviewer" reviews only
    if( 'reviewer' == $db_role->name )
    {
      $modifier->where( 'review_type.name', 'LIKE', 'Reviewer %' );
      $modifier->where( 'review.user_id', '=', $db_user->id );
    }
  }
}
