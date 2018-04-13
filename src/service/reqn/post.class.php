<?php
/**
 * post.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn;
use cenozo\lib, cenozo\log, magnolia\util;

class post extends \cenozo\service\post
{
  /**
   * Replace parent method
   */
  protected function prepare()
  {
    parent::prepare();

    $language_class_name = lib::get_class_name( 'database\language' );
    $db_reqn = $this->get_leaf_record();

    // generate a random identifier if none exists
    if( is_null( $db_reqn->identifier ) ) $db_reqn->identifier = 'T'.rand( 10000, 99999 );

    // if the language_id isn't set then default to English
    if( is_null( $db_reqn->language_id ) )
      $db_reqn->language_id = $language_class_name::get_unique_record( 'code', 'en' )->id;

    // fill in the applicant's email
    if( is_null( $db_reqn->applicant_email ) )
      $db_reqn->applicant_email = lib::create( 'business\session' )->get_user()->email;
  }

  /**
   * Replace parent method
   */
  protected function finish()
  {
    parent::finish();

    $db_reqn = $this->get_leaf_record();

    // create the review records for the new reqn
    $db_review = lib::create( 'database\review' );
    $db_review->reqn_id = $db_reqn->id;
    $db_review->type = 'Admin';
    $db_review->description = '';
    $db_review->save();

    $db_review = lib::create( 'database\review' );
    $db_review->reqn_id = $db_reqn->id;
    $db_review->type = 'SAC';
    $db_review->description = '';
    $db_review->save();
  }
}
