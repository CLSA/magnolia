<?php
/**
 * query.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\reqn;
use cenozo\lib, cenozo\log, magnolia\util;

class query extends \cenozo\service\query
{
  /**
   * Extends the parent method
   */
  protected function prepare()
  {
    $reqn_class_name = lib::get_class_name( 'database\reqn' );

    parent::prepare();

    $search = $this->get_argument( 'search', NULL );
    if( !is_null( $search ) )
    {
      // split the search into all of it's terms (preserving phrases enclosed in quotes)
      preg_match_all( '/[^\s]*"[^"]+"[^\s]*|[^"]?\w+[^"]?/', $search, $matches );
      $terms = current( $matches );
      if( 0 < count( $terms ) )
      {
        $this->modifier->where_bracket( true );
        foreach( $terms as $term ) $reqn_class_name::apply_search_term( trim( $term, '" ' ), $this->modifier );
        $this->modifier->where_bracket( false );
      }
    }
  }

  /**
   * Extends the parent method
   */
  protected function execute()
  {
    parent::execute();

    if( $this->get_argument( 'expire_data', false ) )
    {
      $reqn_class_name = lib::get_class_name( 'database\reqn' );
      $this->set_data( $reqn_class_name::expire_data() );
    }

    if( $this->get_argument( 'send_deferred_reminder_notifications', false ) )
    {
      $reqn_class_name = lib::get_class_name( 'database\reqn' );
      $this->set_data( $reqn_class_name::send_deferred_reminder_notifications() );
    }

    if( $this->get_argument( 'send_expired_ethics_notifications', false ) )
    {
      $reqn_class_name = lib::get_class_name( 'database\reqn' );
      $this->set_data( $reqn_class_name::send_expired_ethics_notifications() );
    }

    if( $this->get_argument( 'send_expired_agreement_notifications', false ) )
    {
      $reqn_class_name = lib::get_class_name( 'database\reqn' );
      $this->set_data( $reqn_class_name::send_expired_agreement_notifications() );
    }

    if( $this->get_argument( 'send_expired_reqn_notifications', false ) )
    {
      $reqn_class_name = lib::get_class_name( 'database\reqn' );
      $this->set_data( $reqn_class_name::send_expired_reqn_notifications() );
    }
  }
}
